using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BO.ViewModel;
using Data.Models;

namespace BO.MappingViewModel
{
    public class RequestMap
    {
        /// <summary>
        ///     Mapea una lista de entidades 
        ///     a modelo de vista
        /// </summary>       
        public List<RequestViewModel> EntityToViewModel(List<requests> requests)
        {
            List<RequestViewModel> result = new List<RequestViewModel>();

            foreach (var item in requests)
            {
                result.Add(EntityToViewModel(item));
            }

            return result;
        }


        /// <summary>
        ///     mapea un objeto entidad 
        ///     a un modelo de vista 
        /// </summary>      
        public RequestViewModel EntityToViewModel(requests entity)
        {
            var model = new RequestViewModel();

            model.RequestId = entity.RequestId;
            model.ConceptId = entity.ConceptId;
            model.AuthorizeId = entity.AuthorizeId;
            model.CopyId = entity.CopyId;
            model.Type = entity.Type;
            model.RegStatus = entity.RegStatus;
            model.CreatedAt = entity.CreatedAt.ToString("dd/MM/yyyy");
            model.UpdatedAt = entity.UpdatedAt.ToString("dd/MM/yyyy");

            return model;
        }

        /// <summary>
        ///     Mapea un modelo de vista
        ///     a una entidad
        /// </summary>      
        public requests ViewModelToEntity(RequestViewModel model)
        {
            requests result = new requests();

            result.RequestId = model.RequestId;
            result.ConceptId = model.ConceptId;
            result.AuthorizeId = model.AuthorizeId;
            result.CopyId = model.CopyId;
            result.Type = model.Type;
            result.RegStatus = model.RegStatus;
            result.CreatedAt = Convert.ToDateTime(model.CreatedAt);
            result.UpdatedAt = Convert.ToDateTime(model.UpdatedAt);

            return result;
        }
    }
}
