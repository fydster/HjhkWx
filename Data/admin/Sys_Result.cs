using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Data
{
    public class Sys_Result
    {
        public int Return { get; set; }
        public string Msg { get; set; }

        /// <summary>
        /// 错误返回
        /// </summary>
        /// <param name="Return"></param>
        /// <param name="Msg"></param>
        /// <returns></returns>
        public static string GetR(int Return, string Msg)
        {
            Sys_Result sr = new Sys_Result
            {
                Return = Return,
                Msg = Msg
            };
            return "{\"Return\":\""+Return+"\",\"Msg\":\""+Msg+"\"}";
        }
    }
}
