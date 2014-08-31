using System.Collections.Generic;
using System.Web.Http;

namespace EveWarehouse.Api.Controllers
{
    [RoutePrefix("api/apiKeys")]
    public class ApiKeyController : ApiController
    {
        [Authorize]
        [Route("")]
        public IHttpActionResult Get()
        {
            return Ok(new List<string> { "foo", "bar" });
        }
    }
}
