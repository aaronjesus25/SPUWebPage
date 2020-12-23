using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BO.MappingViewModel;
using BO.ViewModel;
using Data.Models;
using Data.Repository;

namespace BO.BussinesObject
{
    public class RequestBO
    {
        //objects
        private readonly RequestMap Map = new RequestMap();
        private readonly RequestRespository Repository = new RequestRespository();

        //obtiene la lista de solicitudes
        public ResponseViewModel GetList()
        {
            //variables
            var _result = new ResponseViewModel();
            List<requests> list = new List<requests>();

            //obtengo la lista de usuarios activos 
            list = Repository.GetList().ToList();

            //valida si la lista tiene datos
            if (list.Count > 0)
            {
                _result.Data = Map.EntityToViewModel(list).OfType<object>().ToList();
                _result.Success = true;
                _result.Message = "Lista de clientes cargado";
            }
            else
            {
                _result.Success = false;
                _result.Message = "No hay datos disponibles";
            }

            return _result;
        }

        //Registra una nueva solicitud
        public ResponseViewModel Register(RequestViewModel model)
        {
            //variables
            var _result = new ResponseViewModel();
            DateTime now = DateTime.Today;

            try
            {
                //map entity
                var entity = Map.ViewModelToEntity(model);

                //Crear registro
                var respuesta = Repository.Register(entity);

                //valida la respuesta
                if (respuesta != null)
                {
                    List<RequestViewModel> _list = new List<RequestViewModel>();

                    _list.Add(Map.EntityToViewModel(entity));
                    _result.Message = string.Format("Se ha creado el departamento con identificador: ({0})", entity.RequestId);
                    _result.Data = _list.OfType<object>().ToList();
                    _result.Success = true;
                }
                else
                {
                    _result.Message = "Ha ocurrido un error";
                    _result.Success = false;
                }
            }
            catch (Exception ex)
            {
                _result.Message = ex.Message;
                _result.Success = false;
            }

            return _result;
        }
    }
}
