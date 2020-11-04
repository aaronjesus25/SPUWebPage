using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BO.ViewModel
{
    public partial class UserViewModel
    {
        public int UserId { get; set; }
        public string Nick { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Telephone { get; set; }
        public bool Boss { get; set; }
        public bool Authorizing { get; set; }
        public bool Petitioner { get; set; }
        public bool Copy { get; set; }
        public int Type { get; set; }
        public bool RegStatus { get; set; }
        public string RegTimeStamp { get; set; }
        public string UpdateAt { get; set; }
        public string Pass { get; set; }
    }
}
