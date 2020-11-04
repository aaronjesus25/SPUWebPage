using BO.ViewModel;
using Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BO.MappingViewModel
{
    public class DepartmentMap
    {
        /// <summary>
        ///     Mapea una lista de entidades 
        ///     a modelo de vista
        /// </summary>       
        public List<DepartmentViewModel> EntityToViewModel(List<department> departments)
        {
            List<DepartmentViewModel> result = new List<DepartmentViewModel>();

            foreach (var dep in departments)
            {
                result.Add(EntityToViewModel(dep));
            }

            return result;
        }

        /// <summary>
        ///     mapea un objeto entidad 
        ///     a un modelo de vista 
        /// </summary>      
        public DepartmentViewModel EntityToViewModel(department entity)
        {
            var model = new DepartmentViewModel();

            model.DepartmentId = entity.DepartmentId;
            model.Nombre = entity.Nombre;    
            model.RegStatus = entity.RegStatus;
            model.CreatedAt = entity.CreatedAt.ToString("dd/MM/yyyy");           
            model.UpdatedAt = entity.UpdatedAt.ToString("dd/MM/yyyy");

            return model;
        }

        /// <summary>
        ///     Mapea un modelo de vista
        ///     a una entidad
        /// </summary>      
        public department ViewModelToEntity(DepartmentViewModel model)
        {
            department result = new department();

            result.DepartmentId = model.DepartmentId;
            result.Nombre = model.Nombre;                     
            result.RegStatus = model.RegStatus;
            result.CreatedAt = Convert.ToDateTime(model.CreatedAt);           
            result.UpdatedAt = Convert.ToDateTime(model.UpdatedAt);

            return result;
        }

    }
}
