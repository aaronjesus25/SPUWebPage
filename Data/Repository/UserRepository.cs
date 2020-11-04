using Data.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
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

        /// <summary>
        ///     obtiene la lista de usuarios
        /// </summary>
        public user Login(string user, string password)
        {           
            user userEntity = DataBaseEntities.user.Where(w => w.RegStatus == true && w.Pass == password && w.Nick == user).FirstOrDefault();
            return userEntity;
        }

        /// <summary>
        ///    Elimina un usuario
        /// </summary>
        public user Delete(int userId)
        {
            user userEntity = DataBaseEntities.user.Where(w => w.UserId == userId).FirstOrDefault();

            if (userEntity != null)
            {
                userEntity.RegStatus = false;

                var update = DataBaseEntities.Entry(userEntity);
                update.State = EntityState.Modified;
                DataBaseEntities.SaveChanges();
            }
           
            return userEntity;
        }

        /// <summary>
        ///    Actualiza un usuario
        /// </summary>
        public user Update(user user)
        {
            user userEntity = DataBaseEntities.user.Where(w => w.UserId == user.UserId).FirstOrDefault();

            if (userEntity != null)
            {
                userEntity.Nick = user.Nick;
                userEntity.Name = user.Name;
                userEntity.Email = user.Email;
                userEntity.Telephone = user.Telephone;

                if (!string.IsNullOrEmpty(user.Pass))
                {
                    userEntity.Pass = user.Pass;
                }

                var update = DataBaseEntities.Entry(userEntity);
                update.State = EntityState.Modified;
                DataBaseEntities.SaveChanges();
            }

            return userEntity;
        }
    }
}
