using BO.MappingViewModel;
using BO.ViewModel;
using Data.Models;
using Data.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BO.BussinesObject
{
    public class DepartmentBO
    {
        //objects
        private readonly DepartmentMap Map = new DepartmentMap();
        private readonly DepartmentRepository Repository = new DepartmentRepository();


        //obtiene la lista de usuarios
        public ResponseViewModel GetList()
        {
            //variables
            var _result = new ResponseViewModel();
            List<department> list = new List<department>();

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

        //Registra un nuevo departamento
        public ResponseViewModel Register(DepartmentViewModel model)
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
                    List<DepartmentViewModel> _list = new List<DepartmentViewModel>();

                    _list.Add(Map.EntityToViewModel(entity));
                    _result.Message = string.Format("Se ha creado el departamento {0}", entity.Nombre);
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

        //Elimina un departamento
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
                    List<DepartmentViewModel> _list = new List<DepartmentViewModel>();

                    _list.Add(Map.EntityToViewModel(respuesta));
                    _result.Message = string.Format("Se ha eliminado el departamento {0}", respuesta.Nombre);
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

        //Actualiza un departamento
        public ResponseViewModel Update(DepartmentViewModel model)
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
                    List<DepartmentViewModel> _list = new List<DepartmentViewModel>();

                    _list.Add(Map.EntityToViewModel(respuesta));
                    _result.Message = string.Format("Se ha actualizado el departamento {0}", respuesta.Nombre);
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
