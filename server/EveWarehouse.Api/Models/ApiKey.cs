using System;

namespace EveWarehouse.Api.Models
{
    public class ApiKey
    {
        public long Id { get; set; }
        public string Code { get; set; }
        public long? AccessMask { get; set; }
        public DateTime? ExpirirationDate { get; set; }
    }
}