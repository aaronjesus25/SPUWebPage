using Data.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Repository
{
    public class ConceptRepository
    {
        //variables de la clase
        private readonly UsersManagementEntities DataBaseEntities = new UsersManagementEntities();

        /// <summary>
        ///      Registra un nuevo concepto
        /// </summary>      
        public concept Register(concept concept)
        {
            DateTime dateTime = DateTime.Now;

            try
            {
                concept.CreatedAt = dateTime;
                concept.RegStatus = true;

                DataBaseEntities.concept.Add(concept);
                DataBaseEntities.SaveChanges();
                DataBaseEntities.Entry(concept).GetDatabaseValues();

                return concept;
            }
            catch (Exception dbEx)
            {
                return null;
            }
        }

        /// <summary>
        ///     obtiene la lista de conceptos activos
        /// </summary>
        public List<concept> GetList()
        {
            List<concept> concepts = new List<concept>();
            concepts = DataBaseEntities.concept.Where(w => w.RegStatus == true).ToList();
            return concepts;
        }

        /// <summary>
        ///    Elimina un concepto
        /// </summary>
        public concept Delete(int conceptId)
        {
            concept conceptEntity = DataBaseEntities.concept.Where(w => w.ConceptId == conceptId).FirstOrDefault();

            if (conceptEntity != null)
            {
                conceptEntity.RegStatus = false;

                var update = DataBaseEntities.Entry(conceptEntity);
                update.State = EntityState.Modified;
                DataBaseEntities.SaveChanges();
            }

            return conceptEntity;
        }

        /// <summary>
        ///    Actualiza un concepto
        /// </summary>
        public concept Update(concept concepto)
        {
            concept conceptEntity = DataBaseEntities.concept.Where(w => w.ConceptId == concepto.ConceptId).FirstOrDefault();

            if (conceptEntity != null)
            {
                conceptEntity.Nombre = concepto.Nombre;
                             
                var update = DataBaseEntities.Entry(conceptEntity);
                update.State = EntityState.Modified;
                DataBaseEntities.SaveChanges();
            }

            return conceptEntity;
        }
    }
}
