using eZet.EveLib.Core.Cache;
using StackExchange.Redis;
using System;
using System.Threading.Tasks;

namespace EveWarehouse.Infrastructure.EveLib
{
    public class AzureRedisCache : IEveLibCache
    {
        private const string KeyFormat = "EveLib_{0}";

        public async Task StoreAsync(Uri uri, DateTime cacheTime, string data)
        {
            var connection = await ConnectionMultiplexer.ConnectAsync("");
            var cache = connection.GetDatabase();

            await cache.StringSetAsync(string.Format(KeyFormat, uri), data, cacheTime - DateTime.UtcNow);
        }

        public Task<string> LoadAsync(Uri uri)
        {
            throw new NotImplementedException();
        }

        public bool TryGetExpirationDate(Uri uri, out DateTime value)
        {
            throw new NotImplementedException();
        }
    }
}
