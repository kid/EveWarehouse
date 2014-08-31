using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EveWarehouse.Infrastructure
{
    public static class TaskConstants
    {
        private static readonly Task<bool> booleanTrue = Task.FromResult(true);

        /// <summary>
        /// A <see cref="Task"/> that has been completed.
        /// </summary>
        public static Task Completed
        {
            get { return booleanTrue; }
        }
    }
}
