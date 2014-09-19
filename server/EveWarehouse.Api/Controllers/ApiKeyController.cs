using EveWarehouse.Infrastructure.Storage;
using eZet.EveLib.Modules;
using eZet.EveLib.Modules.Models.Account;
using Microsoft.WindowsAzure.Storage.Table.Queryable;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using ApiKey = EveWarehouse.Domain.Source.Models.ApiKey;

namespace EveWarehouse.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api/apiKeys")]
    public class ApiKeyController : ApiController
    {
        private readonly Repository<ApiKey> _repository;

        public ApiKeyController(Repository<ApiKey> repository)
        {
            _repository = repository;
        }

        [Route("")]
        public async Task<IEnumerable<ApiKey>> Get()
        {
            var query =
                from key in _repository.Query()
                where key.PartitionKey == GetUserId()
                select key;

            return await query.AsTableQuery().ExecuteSegmentedAsync(null);
        }

        [Route("")]
        public async Task<IHttpActionResult> Post([FromBody] ApiKey entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var keyInfos = await GetKeyInfo(entity.Id, entity.Code);

            entity.UserId = GetUserId();
            entity.KeyType = keyInfos.Key.Type;
            entity.AccessMask = keyInfos.Key.AccessMask;
            entity.ExpirationDate = keyInfos.Key.ExpireDate > DateTime.MinValue ? (DateTime?)keyInfos.Key.ExpireDate : null;

            await _repository.Insert(entity);

            return Ok();
        }

        private string GetUserId()
        {
            var claimIdentity = User.Identity as ClaimsIdentity;
            if (claimIdentity == null)
            {
                return null;
            }

            var claim = claimIdentity.FindFirst("sub");
            return claim != null ? claim.Value : null;
        }

        private static async Task<ApiKeyInfo> GetKeyInfo(int id, string code)
        {
            var key = EveOnlineApi.CreateApiKey(id, code);
            var result = await key.GetApiKeyInfoAsync();
            return result.Result;
        }
    }
}
