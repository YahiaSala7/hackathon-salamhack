using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalamHack.Data.MetaData
{
    public static class Router
    {
        public const string root = "api";

        public const string Version = "v1";

        public const string Rule = root+"/"+Version+"/";


        public static class AuthRoutes
        {
            public const string prefix  = Rule+"/"+"auth";
            public const string SignUp = prefix+"sign-up";
            public const string SignIn = prefix + "sign-in";
            public const string SignInWithGoogle = SignIn+"/"+"google";


        }

    }
}
