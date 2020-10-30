using Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Repository
{
    public class UserRepository
    {
        //variables de la clase
        private readonly UsersManagementEntities DataBaseEntities = new UsersManagementEntities();


       /// <summary>
       ///      Registra un nuevo usuario
       /// </summary>      
        public user Register(user user)
        {
            DateTime dateTime = DateTime.Now;
            try
            {
                user.RegTimeStamp = dateTime;
                user.RegStatus = true;

                DataBaseEntities.user.Add(user);
                DataBaseEntities.SaveChanges();
                DataBaseEntities.Entry(user).GetDatabaseValues();

                return user;
            }
            catch (Exception dbEx)
            {
                return null;
            }
        }

        /// <summary>
        ///     obtiene la lista de usuarios
        /// </summary>
        public List<user> GetList()
        {
            List<user> users = new List<user>();
            users = DataBaseEntities.user.Where(w => w.RegStatus == true).ToList();
            return users;
        }
    }
}
