using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data.Models;

namespace Data.Repository
{
    public class DepartmentRepository
    {
        //variables de la clase
        private readonly UsersManagementEntities DataBaseEntities = new UsersManagementEntities();

        /// <summary>
        ///      Registra un nuevo departamento
        /// </summary>      
        public department Register(department dep)
        {
            DateTime dateTime = DateTime.Now;
            try
            {
                dep.CreatedAt = dateTime;
                dep.RegStatus = true;

                DataBaseEntities.department.Add(dep);
                DataBaseEntities.SaveChanges();
                DataBaseEntities.Entry(dep).GetDatabaseValues();

                return dep;
            }
            catch (Exception dbEx)
            {
                return null;
            }
        }

        /// <summary>
        ///     obtiene la lista de departamentos
        /// </summary>
        public List<department> GetList()
        {
            List<department> dep = new List<department>();
            dep = DataBaseEntities.department.Where(w => w.RegStatus == true).ToList();
            return dep;
        }

        /// <summary>
        ///    Elimina un departamento
        /// </summary>
        public department Delete(int depId)
        {
            department depEntity = DataBaseEntities.department.Where(w => w.DepartmentId == depId).FirstOrDefault();

            if (depEntity != null)
            {
                depEntity.RegStatus = false;

                var update = DataBaseEntities.Entry(depEntity);
                update.State = EntityState.Modified;
                DataBaseEntities.SaveChanges();
            }

            return depEntity;
        }

        /// <summary>
        ///    Actualiza un departamento
        /// </summary>
        public department Update(department dep)
        {
            department depEntity = DataBaseEntities.department.Where(w => w.DepartmentId == dep.DepartmentId).FirstOrDefault();

            if (depEntity != null)
            {
                depEntity.Nombre = dep.Nombre;                              

                var update = DataBaseEntities.Entry(depEntity);
                update.State = EntityState.Modified;
                DataBaseEntities.SaveChanges();
            }

            return depEntity;
        }
    }
}
