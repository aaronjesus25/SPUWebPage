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
    
    public partial class user
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
        public System.DateTime RegTimeStamp { get; set; }
        public System.DateTime UpdateAt { get; set; }
        public string Pass { get; set; }
    }
}