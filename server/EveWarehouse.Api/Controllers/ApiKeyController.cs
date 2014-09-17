using EveWarehouse.Domain.Source.Models;
using EveWarehouse.Infrastructure.Storage;
using Microsoft.WindowsAzure.Storage.Table.Queryable;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;

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

            entity.UserId = GetUserId();
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
    }
}
