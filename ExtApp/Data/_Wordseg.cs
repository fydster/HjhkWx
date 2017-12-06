using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExtApp.QQ.AI
{
    public class _Wordseg
    {
        public string url = "https://api.ai.qq.com/fcgi-bin/nlp/nlp_wordseg";

        /// <summary>
        /// 基础文本解析
        /// </summary>
        /// <returns></returns>
        public string wordseg(string text)
        {
            DateTime t = new DateTime(1970, 1, 1);  //得到1970年的时间戳
            long timestamp = (DateTime.UtcNow.Ticks - t.Ticks) / 10000000;  //注意这里有时区问题，用now就要减掉8个小时
            wordseg wd = new wordseg
            {
                app_id = Comm.app_id,
                time_stamp = timestamp,
                text = Comm.utf8_gb2312(text),
                nonce_str = DateTime.Now.ToString("yyMMddHHmmss") + new Random().Next(11111, 99999)
            };

            string result = new Comm().GetResult(new Comm().GetParaList(wd), url);
            return result;
        }
    }
}
