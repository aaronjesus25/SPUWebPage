using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data.Models;

namespace Data.Repository
{
    public class RequestRespository
    {
        //variables de la clase
        private readonly UsersManagementEntities DataBaseEntities = new UsersManagementEntities();

        /// <summary>
        ///      Registra una nueva solicitud
        /// </summary>      
        public requests Register(requests req)
        {
            DateTime dateTime = DateTime.Now;
            try
            {
                req.CreatedAt = dateTime;
                req.RegStatus = true;

                DataBaseEntities.requests.Add(req);
                DataBaseEntities.SaveChanges();
                DataBaseEntities.Entry(req).GetDatabaseValues();

                return req;
            }
            catch (Exception dbEx)
            {
                return null;
            }
        }


        /// <summary>
        ///     obtiene la lista de solicitudes
        /// </summary>
        public List<requests> GetList()
        {
            List<requests> dep = new List<requests>();
            dep = DataBaseEntities.requests.Where(w => w.RegStatus == true).ToList();
            return dep;
        }
    }
}
