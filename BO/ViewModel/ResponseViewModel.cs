using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BO.ViewModel
{
    public partial class ResponseViewModel
    {
        public string Message { get; set; }

        public bool? Success { get; set; }

        public List<object> Data { get; set; }

        public object DataTable { get; set; }

        public UserViewModel User { get; set; }
    }
}
