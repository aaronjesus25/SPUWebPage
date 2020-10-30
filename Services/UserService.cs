using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BO.BussinesObject;
using BO.MappingViewModel;
using BO.ViewModel;

namespace Services
{
    public class UserService
    {
        //objetos
        private UserBO UserObject = new UserBO();
        private readonly UserMap UserMap = new UserMap();

        //servicio solicitud lista de datos
        public ResponseViewModel GetList()
        {
            return UserObject.GetList();
        }

        //servicio solicitud para almacenar registro
        public ResponseViewModel Register(UserViewModel viewModel)
        {
            return UserObject.Register(viewModel);
        }
    }
}
