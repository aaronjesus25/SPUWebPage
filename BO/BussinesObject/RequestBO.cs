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
        public ResponseViewModel GetList(RequestViewModel model)
        {
            //variables
            DateTime dateIni = Convert.ToDateTime(model.DateStart);
            DateTime dateEnd = Convert.ToDateTime(model.DateEnd);
            var _result = new ResponseViewModel();
            List<requests> list = new List<requests>();

            //obtengo la lista de solicitudes activas 
            list = Repository.GetList(dateIni, dateEnd, model.TypeRequest).ToList();

            //valida si la lista tiene datos
            if (list.Count > 0)
            {
                _result.Data = Map.EntityToViewModel(list).OfType<object>().ToList();
                _result.Success = true;
                _result.Message = "Lista de solicitudes cargado";
            }
            else
            {
                _result.Success = false;
                _result.Message = "No hay datos disponibles";
            }

            return _result;
        }

        //obtiene la lista de solicitudes de jefes por id
        public ResponseViewModel GetListBoss(int Id, RequestViewModel model)
        {
            //variables
            DateTime dateIni = Convert.ToDateTime(model.DateStart);
            DateTime dateEnd = Convert.ToDateTime(model.DateEnd);
            var _result = new ResponseViewModel();
            List<requests> list = new List<requests>();

            //obtengo la lista de solicitudes activas 
            list = Repository.GetListBoss(Id, dateIni, dateEnd, model.TypeRequest).ToList();

            //valida si la lista tiene datos
            if (list.Count > 0)
            {
                _result.Data = Map.EntityToViewModel(list).OfType<object>().ToList();
                _result.Success = true;
                _result.Message = "Lista de solicitudes cargado";
            }
            else
            {
                _result.Success = false;
                _result.Message = "No hay datos disponibles";
            }

            return _result;
        }

        //obtiene la lista de solicitudes de solicitantes por id 
        public ResponseViewModel GetListPetitioner(int Id, RequestViewModel model)
        {
            //variables
            DateTime dateIni = Convert.ToDateTime(model.DateStart);
            DateTime dateEnd = Convert.ToDateTime(model.DateEnd);
            var _result = new ResponseViewModel();
            List<requests> list = new List<requests>();

            //obtengo la lista de solicitudes activas 
            list = Repository.GetListPetitioner(Id, dateIni, dateEnd, model.TypeRequest).ToList();

            //valida si la lista tiene datos
            if (list.Count > 0)
            {
                _result.Data = Map.EntityToViewModel(list).OfType<object>().ToList();
                _result.Success = true;
                _result.Message = "Lista de solicitudes cargado";
            }
            else
            {
                _result.Success = false;
                _result.Message = "No hay datos disponibles";
            }

            return _result;
        }

        //obtiene la lista de solicitudes de autorizadores por id 
        public ResponseViewModel GetListAuthorize(int Id, RequestViewModel model)
        {
            //variables
            DateTime dateIni = Convert.ToDateTime(model.DateStart);
            DateTime dateEnd = Convert.ToDateTime(model.DateEnd);
            var _result = new ResponseViewModel();
            List<requests> list = new List<requests>();

            //obtengo la lista de solicitudes activas 
            list = Repository.GetListAuthorize(Id, dateIni, dateEnd, model.TypeRequest).ToList();

            //valida si la lista tiene datos
            if (list.Count > 0)
            {
                _result.Data = Map.EntityToViewModel(list).OfType<object>().ToList();
                _result.Success = true;
                _result.Message = "Lista de solicitudes cargado";
            }
            else
            {
                _result.Success = false;
                _result.Message = "No hay datos disponibles";
            }

            return _result;
        }

        //obtiene la lista de solicitudes de jefes por id 
        public ResponseViewModel GetListCopy(int Id, RequestViewModel model)
        {
            //variables
            DateTime dateIni = Convert.ToDateTime(model.DateStart);
            DateTime dateEnd = Convert.ToDateTime(model.DateEnd);
            var _result = new ResponseViewModel();
            List<requests> list = new List<requests>();

            //obtengo la lista de solicitudes activas 
            list = Repository.GetListCopy(Id, dateIni, dateEnd).ToList();

            //valida si la lista tiene datos
            if (list.Count > 0)
            {
                _result.Data = Map.EntityToViewModel(list).OfType<object>().ToList();
                _result.Success = true;
                _result.Message = "Lista de solicitudes cargado";
            }
            else
            {
                _result.Success = false;
                _result.Message = "No hay datos disponibles";
            }

            return _result;
        }

        //obtiene una solicitud por id
        public ResponseViewModel GetById(int Id)
        {
            //variables
            var _result = new ResponseViewModel();
            List<requests> list = new List<requests>();

            //obtengo la lista de solicitudes activas
            list = Repository.GetById(Id).ToList();

            //valida si la lista tiene datos
            if (list.Count > 0)
            {
                _result.Data = Map.EntityToViewModel(list).OfType<object>().ToList();
                _result.Success = true;
                _result.Message = "Lista de solicitudes cargado";
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
                //valida los accesos de la solicitud
                if (model.LockAutorize == 1)
                {
                    model.AuthorizeId = 1;
                }

                //valida los accesos de la copia
                if (model.LockCopy == 1)
                {
                    model.CopyId = 1;
                }

                //map entity
                var entity = Map.ViewModelToEntity(model);

                //Crear registro
                var respuesta = Repository.Register(entity);

                //valida la respuesta
                if (respuesta != null)
                {
                    List<RequestViewModel> _list = new List<RequestViewModel>();

                    _list.Add(Map.EntityToViewModel(entity));
                    _result.Message = string.Format("Se ha creado la solicitud correctamente", entity.RequestId);
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

        //Elimina una solicitud
        public ResponseViewModel Delete(int Id)
        {
            //variables
            var _result = new ResponseViewModel();

            try
            {

                //eliminar registro
                var respuesta = Repository.Delete(Id);

                //valida la respuesta
                if (respuesta != null)
                {
                    List<RequestViewModel> _list = new List<RequestViewModel>();

                    _list.Add(Map.EntityToViewModel(respuesta));
                    _result.Message = string.Format("Se ha eliminado la solicitud");
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

        //Aprueba una solicitud
        public ResponseViewModel Approve(RequestViewModel model)
        {
            //variables
            var _result = new ResponseViewModel();

            try
            {
                //map to Entity
                var entity = Map.ViewModelToEntity(model);

                //actualizar registro
                var respuesta = Repository.Approve(entity);

                //valida la respuesta
                if (respuesta != null)
                {
                    List<RequestViewModel> _list = new List<RequestViewModel>();

                    _list.Add(Map.EntityToViewModel(respuesta));
                    _result.Message = string.Format("Se ha actualizado la información");
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

        //Actualiza una solicitud
        public ResponseViewModel Update(RequestViewModel model)
        {
            //variables
            var _result = new ResponseViewModel();

            try
            {
                //map to Entity
                var entity = Map.ViewModelToEntity(model);

                //actualizar registro
                var respuesta = Repository.Update(entity);

                //valida la respuesta
                if (respuesta != null)
                {
                    List<RequestViewModel> _list = new List<RequestViewModel>();

                    _list.Add(Map.EntityToViewModel(respuesta));
                    _result.Message = string.Format("Se ha actualizado la información");
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

        //Autoriza una solicitud
        public ResponseViewModel Authorize(RequestViewModel model)
        {
            //variables
            var _result = new ResponseViewModel();

            try
            {
                //map to Entity
                var entity = Map.ViewModelToEntity(model);

                //actualizar registro
                var respuesta = Repository.Authorize(entity);

                //valida la respuesta
                if (respuesta != null)
                {
                    List<RequestViewModel> _list = new List<RequestViewModel>();

                    _list.Add(Map.EntityToViewModel(respuesta));
                    _result.Message = string.Format("Se ha actualizado la información");
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

        //Aprueba una solicitud
        public ResponseViewModel Deny(RequestViewModel model)
        {
            //variables
            var _result = new ResponseViewModel();

            try
            {
                //map to Entity
                var entity = Map.ViewModelToEntity(model);

                //actualizar registro
                var respuesta = Repository.Deny(entity);

                //valida la respuesta
                if (respuesta != null)
                {
                    List<RequestViewModel> _list = new List<RequestViewModel>();

                    _list.Add(Map.EntityToViewModel(respuesta));
                    _result.Message = string.Format("Se ha actualizado la información");
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
