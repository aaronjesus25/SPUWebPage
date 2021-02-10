using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BO.ViewModel
{
    public class AuthDepartmentViewModel
    {
        public int UserId { get; set; }
        public int DepartmentId { get; set; }
        public int AuthorizeDepartmentId { get; set; }

        public DepartmentViewModel department { get; set; }
        public UserViewModel user { get; set; }
    }
}
