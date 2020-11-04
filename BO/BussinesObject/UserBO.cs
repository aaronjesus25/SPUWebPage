using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data.Models;
using Data.Repository;
using BO.MappingViewModel;
using BO.ViewModel;
using BO.BussinesObject;

namespace BO.BussinesObject
{
    public class UserBO
    {
        //objects
        private readonly UserMap UserMap = new UserMap();
        private readonly UserRepository UserRepository = new UserRepository();

        //obtiene la lista de usuarios
        public ResponseViewModel GetList()
        {
            //variables
            var _result = new ResponseViewModel();
            List<user> list = new List<user>();

            //obtengo la lista de usuarios activos 
            list = UserRepository.GetList().ToList();

            //valida si la lista tiene datos
            if (list.Count > 0)
            {
                _result.Data = UserMap.EntityToViewModel(list).OfType<object>().ToList();
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

        //Registra un nuevo usuario
        public ResponseViewModel Register(UserViewModel viewModel)
        {
            //variables
            var _result = new ResponseViewModel();
            DateTime now = DateTime.Today;
            
            try
            {
                //map entity
                var usuario = UserMap.ViewModelToEntity(viewModel);

                //Crear registro
                var respuesta = UserRepository.Register(usuario);

                //valida la respuesta
                if (respuesta != null)
                {
                    List<UserViewModel> _list = new List<UserViewModel>();

                    _list.Add(UserMap.EntityToViewModel(usuario));
                    _result.Message = string.Format("Se ha creado el usuario {0}", usuario.Name);
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

        //Registra un nuevo usuario
        public ResponseViewModel Delete(int userId)
        {
            //variables
            var _result = new ResponseViewModel();
            
            try
            {
                
                //eliminar registro
                var respuesta = UserRepository.Delete(userId);

                //valida la respuesta
                if (respuesta != null)
                {
                    List<UserViewModel> _list = new List<UserViewModel>();

                    _list.Add(UserMap.EntityToViewModel(respuesta));
                    _result.Message = string.Format("Se ha eliminado el usuario {0}", respuesta.Name);
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

        //Registra un nuevo usuario
        public ResponseViewModel Update(UserViewModel viewModel)
        {
            //variables
            var _result = new ResponseViewModel();

            try
            {
                 //map to Entity
                 var usuario = UserMap.ViewModelToEntity(viewModel);

                //actualizar registro
                var respuesta = UserRepository.Update(usuario);

                //valida la respuesta
                if (respuesta != null)
                {
                    List<UserViewModel> _list = new List<UserViewModel>();

                    _list.Add(UserMap.EntityToViewModel(respuesta));
                    _result.Message = string.Format("Se ha actualizado el usuario {0}", respuesta.Name);
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

        //obtiene un usuario especificado
        public UserViewModel Login(string user, string pass)
        {
            //variables
            UserViewModel viewModel = null;

            //obtengo el usuario activo
            var result = UserRepository.Login(user, pass);
            
            if (result != null)
            {
                viewModel = UserMap.EntityToViewModel(result);
            }

            return viewModel;
        }
    }
}
