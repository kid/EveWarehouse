using Humanizer;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace EveWarehouse.Infrastructure.Storage
{
    public interface IStorageKeysMapper<in TEntity>
    {
        string GetRowKeyFromEntity(TEntity entity);
        string GetPartitionKeyFromEntity(TEntity entity);
    }

    public class Repository<TEntity> where TEntity : ITableEntity, new()
    {
        private readonly IStorageKeysMapper<TEntity> _storageKeysMapper;
        private readonly CloudTable _table;

        public Repository(IStorageKeysMapper<TEntity> storageKeysMapper, CloudTableClient tableClient)
        {
            if (storageKeysMapper == null) throw new ArgumentNullException("storageKeysMapper");
            if (tableClient == null) throw new ArgumentNullException("tableClient");

            _storageKeysMapper = storageKeysMapper;

            _table = tableClient.GetTableReference(typeof(TEntity).Name.Pluralize());
            _table.CreateIfNotExists();
        }

        public async Task Insert(TEntity entity)
        {
            entity.RowKey = _storageKeysMapper.GetRowKeyFromEntity(entity);
            entity.PartitionKey = _storageKeysMapper.GetPartitionKeyFromEntity(entity);

            await _table.ExecuteAsync(TableOperation.Insert(entity));
        }

        public IQueryable<TEntity> Query()
        {
            return _table.CreateQuery<TEntity>();
        }
    }
}
