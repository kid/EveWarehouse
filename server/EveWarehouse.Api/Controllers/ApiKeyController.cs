using EveWarehouse.Domain.Source.Models;
using EveWarehouse.Infrastructure.Storage;
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
        public async Task<IHttpActionResult> Get()
        {
            var result = await _repository.Query();
            return Ok(result);
        }

        [Route("")]
        public async Task<IHttpActionResult> Post([FromBody] ApiKey entity)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _repository.Insert(entity);
            return Ok();
        }
    }
}
