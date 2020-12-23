using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BO.ViewModel
{
    public class RequestViewModel
    {
        public int RequestId { get; set; }
        public int ConceptId { get; set; }
        public int CopyId { get; set; }
        public int AuthorizeId { get; set; }
        public string CreatedAt { get; set; }
        public string UpdatedAt { get; set; }
        public bool RegStatus { get; set; }
        public int Type { get; set; }
        public int UserId { get; set; }
    }
}
