using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalamHack.Data.Helper
{
    public class ResultViewModel
    {
        public bool IsSucceeded { get; set; }
        public List<string> Messages { get; set; }


    }
    //return Result<Response || PagedList<Project>>.Success(Object , Messages If Needed)
    public class Result<T> : ResultViewModel
    {
        public T Data { get; set; }

        public static Result<T> Success(T data, List<string>? messages)// override
        {
            return new()
            {
                Data = data,
                IsSucceeded = true,
                Messages = messages ?? Enumerable.Empty<string>().ToList(),
            };
        }

        public static Result<T> Success(params string[] messages)
        {
            return new()
            {
                Messages = messages.Any() ? messages.ToList() : null,
                IsSucceeded = true
            };
        }

        public static Result<T> Success(T data)
        {
            return new()
            {
                Data = data,
                IsSucceeded = true,

            };
        }   
        public static Result<T> Faild(T data)
        {
            return new()
            {
                Data = data,
                IsSucceeded = false,

            };
        }

        public static Result<T> Failed(params string[] messages)
        {
            return new()
            {
                Messages = messages.Any() ? messages.ToList() : null,
                IsSucceeded = false
            };
        }
    }
}
