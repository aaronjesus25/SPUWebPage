using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BO.ViewModel
{
    public class QuestionViewModel
    {
        public int questionId { get; set; }
        public string Text { get; set; }
        public bool RegStatus { get; set; }
        public string CreatedAt { get; set; }
        public string UpdatedAt { get; set; }
        public int RequestId { get; set; }
    }
}
