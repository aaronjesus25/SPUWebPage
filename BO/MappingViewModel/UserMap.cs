using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BO.ViewModel;
using Data.Models;

namespace BO.MappingViewModel
{
    public class UserMap
    {

        /// <summary>
        ///     Mapea una lista de entidades 
        ///     a modelo de vista
        /// </summary>       
        public List<UserViewModel> EntityToViewModel(List<user> users)
        {
            List<UserViewModel> result = new List<UserViewModel>();

            foreach(var user in users)
            {
                result.Add(EntityToViewModel(user));
            }

            return result;
        }

        /// <summary>
        ///     mapea un objeto entidad 
        ///     a un modelo de vista 
        /// </summary>      
        public UserViewModel EntityToViewModel(user entity)
        {
            var model = new UserViewModel();
            model.UserId = entity.UserId;
            model.Authorizing = entity.Authorizing;
            model.Boss = entity.Boss;
            model.Copy = entity.Copy;
            model.Email = entity.Email;
            model.Name = entity.Name;
            model.Nick = entity.Nick;
            model.Pass = entity.Pass;
            model.Petitioner = entity.Petitioner;
            model.RegStatus = entity.RegStatus;
            model.RegTimeStamp = entity.RegTimeStamp;
            model.Telephone = entity.Telephone;
            model.Type = entity.Type;
            model.UpdateAt = entity.UpdateAt;
            
            return model;
        }

        /// <summary>
        ///     Mapea un modelo de vista
        ///     a una entidad
        /// </summary>      
        public user ViewModelToEntity(UserViewModel model)
        {
            user result = new user();
            result.UserId = model.UserId;
            result.Authorizing = model.Authorizing;
            result.Boss = model.Boss;
            result.Copy = model.Copy;
            result.Email = model.Email;
            result.Name = model.Name;
            result.Nick = model.Nick;
            result.Pass = model.Pass;
            result.Petitioner = model.Petitioner;
            result.RegStatus = model.RegStatus;
            result.RegTimeStamp = model.RegTimeStamp;
            result.Telephone = model.Telephone;
            result.Type = model.Type;
            result.UpdateAt = model.UpdateAt;

            return result;
        }
    }
}
