using EveWarehouse.Api.Models;
using System.Collections.Generic;
using System.Web.Http;

namespace EveWarehouse.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api/apiKeys")]
    public class ApiKeyController : ApiController
    {
        public IHttpActionResult Get()
        {
            return Ok(new List<ApiKey> { 
                new ApiKey { Id = 1, Code = "Foo" }
            });
        }
    }
}
