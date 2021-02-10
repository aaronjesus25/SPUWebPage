using Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BO.ViewModel
{
    public class RequestViewModel
    {
        //model
        public int RequestId { get; set; }
        public int ConceptId { get; set; }
        public int CopyId { get; set; }
        public int AuthorizeId { get; set; }
        public string CreatedAt { get; set; }
        public string UpdatedAt { get; set; }
        public bool RegStatus { get; set; }
        public int Type { get; set; }
        public int UserId { get; set; }//8

        //display to report
        public string UserName { get; set; }//9
        public string ConceptName { get; set; }//10
        public string StatusName { get; set; }//11
        public string Pregunta1 { get; set; }//12
        public string Pregunta2 { get; set; }//13
        public string Pregunta3 { get; set; }//14
        public string Pregunta4 { get; set; }//15
        public string Pregunta5 { get; set; }//16


        //filters to report
        public string DateStart { get; set; }//17
        public string DateEnd { get; set; }//18
        public int TypeRequest { get; set; }//19

        //permisos solicitud
        public int LockCopy { get; set; }
        public int LockAutorize { get; set; }


        public ICollection<questions> Questions { get; set; }
        public ICollection<QuestionViewModel> QuestionsVM { get; set; }
    }
}
