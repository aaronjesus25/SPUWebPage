using System;
using System.Collections.Generic;
using System.Data.Entity;
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
        ///    Elimina una solicitud
        /// </summary>
        public requests Delete(int Id)
        {
            requests Entity = DataBaseEntities.requests.Where(w => w.RequestId == Id).FirstOrDefault();

            if (Entity != null)
            {
                Entity.RegStatus = false;

                var update = DataBaseEntities.Entry(Entity);
                update.State = EntityState.Modified;
                DataBaseEntities.SaveChanges();
            }

            return Entity;
        }

        /// <summary>
        ///     obtiene la lista de solicitudes
        /// </summary>
        public List<requests> GetList(DateTime start, DateTime end, int typeRequest)
        {
            //obtengo la lista filtrada de la bd
            List<requests> dep = new List<requests>();
            dep = DataBaseEntities.requests.Where(w => w.RegStatus == true && 
                                                  w.CreatedAt >= start && w.CreatedAt <= end && 
                                                  w.Type == typeRequest).ToList();
            //retorno
            return dep;
        }

        /// <summary>
        ///     obtiene la lista de solicitudes de jefes
        /// </summary>
        public List<requests> GetListBoss(int Id, DateTime start, DateTime end, int typeRequest)
        {
            //lista vacia 
            List<requests> dep = new List<requests>();

            /*obtengo el usuario 
            para saber el departamento*/
            var user = DataBaseEntities.user.Where(w => w.UserId == Id).FirstOrDefault();  
            
            //obtengo las solicitudes por departamento
            dep = DataBaseEntities.requests.Where(w => w.RegStatus == true &&  
                                                  //w.user.department.DepartmentId == user.department.DepartmentId && 
                                                  w.CreatedAt >= start && w.CreatedAt <= end &&
                                                  w.Type == typeRequest).ToList();

            //retorno
            return dep;
        }

        /// <summary>
        ///     obtiene la lista de solicitudes por solicitante
        /// </summary>
        public List<requests> GetListPetitioner(int Id, DateTime start, DateTime end, int typeRequest)
        {
            //lista vacia 
            List<requests> req = new List<requests>();
           
            //obtengo las solicitudes por departamento
            req = DataBaseEntities.requests.Where(w => w.RegStatus == true && w.UserId == Id && w.CreatedAt >= start && w.CreatedAt <= end && w.Type == typeRequest).ToList();

            //retorno
            return req;
        }

        /// <summary>
        ///     obtiene la lista de solicitudes de autorizadores
        /// </summary>
        public List<requests> GetListAuthorize(int Id, DateTime start, DateTime end, int typeRequest)
        {
            //lista vacia 
            List<requests> dep = new List<requests>();

            //obtengo las solicitudes por departamento 
            dep = DataBaseEntities.requests.Where(w => w.AuthorizeId == Id && w.Type == typeRequest && w.RegStatus && w.CreatedAt >= start && w.CreatedAt <= end).ToList();

            //retorno
            return dep;
        }

        /// <summary>
        ///     obtiene la lista de solicitudes de copias
        /// </summary>
        public List<requests> GetListCopy(int Id, DateTime start, DateTime end)
        {
            //lista vacia
            List<requests> dep = new List<requests>();

            //obtengo el usuario 
            var userObj = DataBaseEntities.user.Where(w => w.UserId == Id).FirstOrDefault();

            //obtengo las solicitudes por departamento
            dep = DataBaseEntities.requests.Where(w => w.user.DepartmentId == userObj.DepartmentId || w.CopyId == Id  && w.Type == 2 && w.RegStatus && w.CreatedAt >= start && w.CreatedAt <= end).ToList();

            //retorno
            return dep;
        }

        /// <summary>
        ///     obtiene una solicitud por id
        /// </summary>
        public List<requests> GetById(int Id)
        {
            //lista vacia
            List<requests> dep = new List<requests>();

            //obtengo las solicitudes por departamento
            dep = DataBaseEntities.requests.Where(w => w.RequestId == Id).ToList();

            //retorno
            return dep;
        }

        /// <summary>
        ///    Aprueba una solicitud
        /// </summary>
        public requests Approve(requests req)
        {
            //actualiza las respuestas 
            if (req.questions != null)
            {
                foreach (var item in req.questions)
                {
                    var question = DataBaseEntities.questions.Where(w => w.questionId == item.questionId).FirstOrDefault();

                    if (question != null)
                    {
                        question.Answer = string.IsNullOrEmpty(item.Answer) ? string.Empty : item.Answer;
                        var questionUpdate = DataBaseEntities.Entry(question);
                        questionUpdate.State = EntityState.Modified;
                    }
                }
            }

            //Actualiza la solicitud
            requests reqEntity = DataBaseEntities.requests.Where(w => w.RequestId == req.RequestId).FirstOrDefault();

            if (reqEntity != null)
            {
                //si no es obligatorio puedo actualizar
                if (reqEntity.LockAutorize != 2)
                {
                    reqEntity.AuthorizeId = req.AuthorizeId;                  
                }

                if (reqEntity.LockCopy != 2)
                {
                    reqEntity.CopyId = req.CopyId;
                }

                reqEntity.Type = 1;

                var update = DataBaseEntities.Entry(reqEntity);
                update.State = EntityState.Modified;
                DataBaseEntities.SaveChanges();
            }

            return reqEntity;
        }

        /// <summary>
        ///    actualiza una solicitud
        /// </summary>
        public requests Update(requests req)
        {
            //busca la solicitud
            requests reqEntity = DataBaseEntities.requests.Where(w => w.RequestId == req.RequestId).FirstOrDefault();

            if (reqEntity != null)
            {
                //asigna los nuevos datos 
                reqEntity.ConceptId = req.ConceptId;
                reqEntity.CopyId = req.CopyId;
                reqEntity.AuthorizeId = req.AuthorizeId;

                //elimina las preguntas antes asignadas 
                DataBaseEntities.questions.RemoveRange(reqEntity.questions);
                DataBaseEntities.SaveChanges();

                //asigna las nuevas preguntas 
                reqEntity.questions = req.questions;

                //actualiza la base de datos 
                var update = DataBaseEntities.Entry(reqEntity);
                update.State = EntityState.Modified;
                DataBaseEntities.SaveChanges();
            }

            return reqEntity;
        }

        /// <summary>
        ///    Autoriza una solicitud
        /// </summary>
        public requests Authorize(requests req)
        {
            requests reqEntity = DataBaseEntities.requests.Where(w => w.RequestId == req.RequestId).FirstOrDefault();

            if (reqEntity != null)
            {
                reqEntity.Type = 2;

                var update = DataBaseEntities.Entry(reqEntity);
                update.State = EntityState.Modified;
                DataBaseEntities.SaveChanges();
            }

            return reqEntity;
        }

        /// <summary>
        ///    Rechaza una solicitud
        /// </summary>
        public requests Deny(requests req)
        {
            requests reqEntity = DataBaseEntities.requests.Where(w => w.RequestId == req.RequestId).FirstOrDefault();

            if (reqEntity != null)
            {
                reqEntity.Type = 3;

                var update = DataBaseEntities.Entry(reqEntity);
                update.State = EntityState.Modified;
                DataBaseEntities.SaveChanges();
            }

            return reqEntity;
        }
    }
}
