﻿using System.Collections.Generic;

namespace LTRegistratorApi.Model
{
    /// <summary>
    /// Describes project entity.
    /// </summary>
    public class Project
    {
        public int ProjectId { get; set; }
        public string Name { get; set; }

        public ICollection<ProjectEmployee> ProjectEmployee { get; set; }
    }
}
