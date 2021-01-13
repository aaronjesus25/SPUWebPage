using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BO.BussinesObject;
using BO.ViewModel;
using Data.Models;

namespace BO.MappingViewModel
{
    public class RequestMap
    {
        //objetos
        private UserBO UserObject = new UserBO();

        /// <summary>
        ///     Mapea una lista de entidades 
        ///     a modelo de vista
        /// </summary>       
        public List<RequestViewModel> EntityToViewModel(List<requests> requests)
        {
            List<RequestViewModel> result = new List<RequestViewModel>();

            foreach (var item in requests)
            {
                result.Add(EntityToViewModel(item));
            }

            return result;
        }


        /// <summary>
        ///     mapea un objeto entidad 
        ///     a un modelo de vista 
        /// </summary>      
        public RequestViewModel EntityToViewModel(requests entity)
        {
            var model = new RequestViewModel();

            model.RequestId = entity.RequestId;
            model.UserId = entity.UserId;
            model.ConceptId = entity.ConceptId;
            model.AuthorizeId = entity.AuthorizeId;
            model.CopyId = entity.CopyId;
            model.Type = entity.Type;
            model.RegStatus = entity.RegStatus;
            model.CreatedAt = entity.CreatedAt.ToString("dd/MM/yyyy");
            model.UpdatedAt = entity.UpdatedAt.ToString("dd/MM/yyyy");
            model.QuestionsVM = new List<QuestionViewModel>();

            //get aditional info 
            var userRequest = UserObject.GetById(entity.UserId);

            //preguntas 
            foreach (var item in entity.questions)
            {
                QuestionViewModel questionVM = new QuestionViewModel
                {
                    RequestId = item.RequestId,
                    questionId = item.questionId,
                    RegStatus = item.RegStatus,
                    Text = item.Text,                    
                    CreatedAt = item.CreatedAt.ToShortDateString(),
                    UpdatedAt = item.UpdatedAt.ToShortDateString()
                };

                model.QuestionsVM.Add(questionVM);
            }

            //usuario
            if (userRequest != null)
            {
                model.UserName = userRequest.Name;
            }

            //concepto
            if (entity.concept != null)
            {
                model.ConceptName = entity.concept.Nombre;
            }

            //status (0:Solicitado, 1:Aprobado, 2:Autorizado, 3:Rechazado)
            switch (entity.Type)
            {
                case 0:
                    model.StatusName = "Solicitado";
                    break;

                case 1:
                    model.StatusName = "Aprobado";
                    break;

                case 2:
                    model.StatusName = "Autorizado";
                    break;

                case 3:
                    model.StatusName = "Rechazado";
                    break;
            }

            return model;
        }

        /// <summary>
        ///     Mapea un modelo de vista
        ///     a una entidad
        /// </summary>      
        public requests ViewModelToEntity(RequestViewModel model)
        {
            requests result = new requests();

            result.UserId = model.UserId;
            result.RequestId = model.RequestId;
            result.ConceptId = model.ConceptId;
            result.AuthorizeId = model.AuthorizeId;
            result.CopyId = model.CopyId;
            result.Type = model.Type;
            result.RegStatus = model.RegStatus;
            result.CreatedAt = Convert.ToDateTime(model.CreatedAt);
            result.UpdatedAt = Convert.ToDateTime(model.UpdatedAt);
            result.questions = model.Questions;

            return result;
        }
    }
}
