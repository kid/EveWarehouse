using eZet.EveLib.Core.Cache;
using StackExchange.Redis;
using System;
using System.Threading.Tasks;

namespace EveWarehouse.Infrastructure.EveLib
{
    public class AzureRedisCache : IEveLibCache
    {
        private readonly ConnectionMultiplexer _redis;
        private const string KeyFormat = "EveLib_{0}";

        public AzureRedisCache(ConnectionMultiplexer redis)
        {
            if (redis == null) throw new ArgumentNullException("redis");

            _redis = redis;
        }

        public Task StoreAsync(Uri uri, DateTime cacheTime, string data)
        {
            return _redis.GetDatabase().StringSetAsync(GetKey(uri), data, cacheTime - DateTime.UtcNow, flags: CommandFlags.FireAndForget);
        }

        public async Task<string> LoadAsync(Uri uri)
        {
            return await _redis.GetDatabase().StringGetAsync(GetKey(uri));
        }

        public bool TryGetExpirationDate(Uri uri, out DateTime value)
        {
            var ttl = _redis.GetDatabase().KeyTimeToLive(GetKey(uri));
            value = ttl.HasValue ? DateTime.UtcNow + ttl.Value : DateTime.MinValue;
            return ttl.HasValue;
        }

        private static string GetKey(Uri uri)
        {
            return string.Format(KeyFormat, uri);
        }
    }
}
