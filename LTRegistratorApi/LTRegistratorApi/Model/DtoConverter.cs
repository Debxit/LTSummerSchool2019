﻿using System.Collections.Generic;
using System.Linq;
using LTRegistrator.Domain.Entities;

namespace LTRegistratorApi.Model
{
    /// <summary>
    /// Class with methods performing transformations with dto
    /// </summary>
    public static class DtoConverter
    {
        /// <summary>
        /// List<ProjectEmployee> to List<Project>
        /// </summary>
        /// <returns>List<Project>, which contains basic information about the List<ProjectEmployee></returns>
        public static List<Project> ToProject(List<ProjectEmployee> listOfPE)
        {
            var result = new List<Project>();
            if (listOfPE == null) return null;
            foreach (var pe in listOfPE)
                result.Add(new Project { Id = pe.ProjectId, Name = pe.Project.Name });

            return result;
        }

        /// <summary>
        /// List<Project> to List<ProjectDto>
        /// </summary>
        /// <returns>List<ProjectDto>, which contains basic information about the List<Project></returns>
        public static List<ProjectDto> ToProjectDto(List<Project> projects)
        {
            var result = new List<ProjectDto>();
            if (projects == null) return null;
            foreach (var project in projects)
                result.Add(new ProjectDto { ProjectId = project.Id, Name = project.Name });

            return result;
        }

        /// <summary>
        /// List<Employee> to List<EmployeeDto>
        /// </summary>
        /// <returns>List<EmployeeDto>, which contains basic information about the List<Employee></returns>
        public static List<EmployeeDto> ToEmployeeDto(List<Employee> employees)
        {
            var result = new List<EmployeeDto>();
            foreach (var employee in employees)
            {
                result.Add(new EmployeeDto
                {
                    EmployeeId = employee.Id,
                    FirstName = employee.FirstName,
                    SecondName = employee.SecondName,
                    Mail = employee.Mail,
                    MaxRole = employee.MaxRole,
                    Rate = employee.Rate,
                    ManagerId = employee.ManagerId,
                    Projects  = ToProjectDto(ToProject(employee.ProjectEmployees?.ToList()))
                });
            }
            return result;
        }

        /// <summary>
        /// Employee to EmployeeDto
        /// </summary>
        /// <returns>EmployeeDto, which contains basic information about the Employee</returns>
        public static EmployeeDto ToEmployeeDto(Employee employee) 
            => ToEmployeeDto(new List<Employee> { employee })[0];
    }
}
