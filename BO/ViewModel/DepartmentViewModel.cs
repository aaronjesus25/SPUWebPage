﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BO.ViewModel
{
    public partial class DepartmentViewModel
    {
        public int DepartmentId { get; set; }
        public string Nombre { get; set; }
        public string CreatedAt { get; set; }
        public string UpdatedAt { get; set; }
        public bool RegStatus { get; set; }
    }
}