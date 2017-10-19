using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Data.Tmessage
{
    public class TMsg_Vote
    {
        public MessageValue first { get; set; }
        /// <summary>
        /// 投票标题
        /// </summary>
        public MessageValue keyword1 { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public MessageValue keyword2 { get; set; }
        /// <summary>
        /// 后缀
        /// </summary>
        public MessageValue remark { get; set; }

        /// <summary>
        /// 获取模板消息体
        /// </summary>
        /// <param name="first"></param>
        /// <param name="keyword1"></param>
        /// <param name="keyword2"></param>
        /// <param name="remark"></param>
        /// <returns></returns>
        public TMsg_Vote GetMessageBody(string first, string keyword1, string keyword2, string remark, out string MsgContent)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append(first);
            sb.Append(",投票标题:" + keyword1);
            sb.Append(",创建时间:" + keyword2);
            sb.Append("," + remark);
            MsgContent = sb.ToString();

            TMsg_Vote s = new TMsg_Vote
            {
                first = new MessageValue { value = first, color = "#d9534f" },
                keyword1 = new MessageValue { value = keyword1, color = "" },
                keyword2 = new MessageValue { value = keyword2, color = "" },
                remark = new MessageValue { value = remark, color = "#428bca" }
            };
            return s;
        }

        /// <summary>
        /// 模板消息ID
        /// </summary>
        /// <returns></returns>
        public string Key()
        {
            return "ZXJALw0SyVfWAtAZuWQ3lprGr0KV4AGnwE8Kpx4X9sY";
        }
    }
}
