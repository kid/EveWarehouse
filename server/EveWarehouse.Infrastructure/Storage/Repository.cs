using Microsoft.WindowsAzure.Storage.Table;
using System;

namespace EveWarehouse.Infrastructure.Storage
{
    public class Repository<TEntity> where TEntity : ITableEntity
    {
        private readonly CloudTableClient _tableClient;

        public Repository(CloudTableClient tableClient)
        {
            if (tableClient == null) throw new ArgumentNullException("tableClient");

            _tableClient = tableClient;
        }

        public void Insert(params TEntity[] entities)
        {

        }
    }
}
