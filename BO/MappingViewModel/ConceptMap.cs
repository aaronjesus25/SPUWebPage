using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BO.ViewModel;
using Data.Models;

namespace BO.MappingViewModel
{
    public class ConceptMap
    {
        /// <summary>
        ///     Mapea una lista de entidades 
        ///     a modelo de vista
        /// </summary>       
        public List<ConceptViewModel> EntityToViewModel(List<concept> con)
        {
            List<ConceptViewModel> result = new List<ConceptViewModel>();

            foreach (var c in con)
            {
                result.Add(EntityToViewModel(c));
            }

            return result;
        }

        /// <summary>
        ///     mapea un objeto entidad 
        ///     a un modelo de vista 
        /// </summary>      
        public ConceptViewModel EntityToViewModel(concept entity)
        {
            var model = new ConceptViewModel();

            model.ConceptId = entity.ConceptId;
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
        public concept ViewModelToEntity(ConceptViewModel model)
        {
            concept result = new concept();

            result.ConceptId = model.ConceptId;
            result.Nombre = model.Nombre;
            result.RegStatus = model.RegStatus;
            result.CreatedAt = Convert.ToDateTime(model.CreatedAt);
            result.UpdatedAt = Convert.ToDateTime(model.UpdatedAt);

            return result;
        }
    }
}
