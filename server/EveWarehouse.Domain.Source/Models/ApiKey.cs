using EveWarehouse.Infrastructure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Globalization;

namespace EveWarehouse.Domain.Source.Models
{
    public class ApiKey : TableEntity
    {
        public class ApiKeyMapper : IStorageKeysMapper<ApiKey>
        {
            public string GetRowKeyFromEntity(ApiKey entity)
            {
                return string.Format(CultureInfo.InvariantCulture, "{0}-{1}", entity.UserId, entity.Id);
            }

            public string GetPartitionKeyFromEntity(ApiKey entity)
            {
                return entity.UserId.ToString(CultureInfo.InvariantCulture);
            }
        }

        public long Id { get; set; }
        public string Code { get; set; }
        public string UserId { get; set; }
        public int AccessMask { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public ApiKeyType KeyType { get; set; }
    }

    [Flags]
    public enum ApiKeyType
    {
        None = 0,
        Account = 1,
        Character = 2,
        Corporation = 4
    }
}
