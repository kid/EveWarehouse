using EveWarehouse.Infrastructure.Storage;
using eZet.EveLib.Modules;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
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

        public int Id { get; set; }
        public string Code { get; set; }
        public string UserId { get; set; }
        public int AccessMask { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public ApiKeyType KeyType { get; set; }

        public override void ReadEntity(IDictionary<string, EntityProperty> properties, OperationContext operationContext)
        {
            EntityProperty property;
            if (!properties.TryGetValue("KeyType", out property))
            {
                return;
            }

            if (property.Int32Value != null)
            {
                KeyType = (ApiKeyType)property.Int32Value;
            }

            base.ReadEntity(properties, operationContext);
        }

        public override IDictionary<string, EntityProperty> WriteEntity(OperationContext operationContext)
        {
            var properties = base.WriteEntity(operationContext);
            properties["KeyType"] = new EntityProperty((int)KeyType);
            return properties;
        }
    }
}
