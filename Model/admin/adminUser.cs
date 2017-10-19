using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model
{
    public class adminUser
    {
        public int id { get; set; }
        /// <summary>
        /// 姓名
        /// </summary>
        public string name { get; set; }
        /// <summary>
        /// 后台登陆用户名
        /// </summary>
        public string uName { get; set; }
        /// <summary>
        /// 后台登陆密码
        /// </summary>
        public string uPass { get; set; }
        /// <summary>
        /// 联系电话
        /// </summary>
        public string mobile { get; set; }
        /// <summary>
        /// 微信唯一编号
        /// </summary>
        public string openid { get; set; }
        /// <summary>
        /// 添加时间
        /// </summary>
        public DateTime addOn { get; set; }
        /// <summary>
        /// 状态
        /// </summary>
        public int enable { get; set; }
        /// <summary>
        /// 备注
        /// </summary>
        public string memo { get; set; }
        /// <summary>
        /// 菜单权限
        /// </summary>
        public string limits { get; set; }
        /// <summary>
        /// 角色ID
        /// </summary>
        public int role { get; set; }
    }
}
