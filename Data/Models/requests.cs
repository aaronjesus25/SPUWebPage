//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Data.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations.Schema;

    public partial class requests
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public requests()
        {
            this.questions = new HashSet<questions>();
        }
    
        public int RequestId { get; set; }
        public int ConceptId { get; set; }
        public int CopyId { get; set; }
        public int AuthorizeId { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime UpdatedAt { get; set; }
        public bool RegStatus { get; set; }
        public int Type { get; set; }
        public int UserId { get; set; }
        public int LockCopy { get; set; }
        public int LockAutorize { get; set; }
    
        public virtual concept concept { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<questions> questions { get; set; }

        [ForeignKey("UserId")]
        public virtual user user { get; set; }

        [ForeignKey("AuthorizeId")]
        public virtual user user1 { get; set; }

        [ForeignKey("CopyId")]
        public virtual user user2 { get; set; }
    }
}
