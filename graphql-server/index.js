const {ApolloServer, gql} = require('apollo-server');
const CustomerService = require('./datasource/file.js');
const ProjectService = require('./datasource/project.js');

const typeDefs = gql`
type Query{
  customers: [Customer],
  findCustomerById(id:ID): Customer,
  filterCustomers(
    id: ID,
    first_name: String,
    last_name: String,
    car_make: String,
  ): [Customer],
  projects: [Project],
  findProjectById(id:ID): Project
}
type Customer{
  id: ID!,
  first_name: String,
  last_name: String
  email: String @deprecated(reason: "we don't have verified mail"),
  car_make: String,
  car_model: String,
  vin_number: String,
  manufactured_date: String,
  age: Int,
  projects: [Project],
},
type Project{
  id: ID,
  projectName: String,
  startDate: String,
  client: String,
  employees: [Int]
}`

const dataSources=()=>({
  customerService: new CustomerService(),
  projectService: new ProjectService(),
})
const resolvers = {
  Query: {
    customers: (parent, args, { dataSources }, info)=>{ 
      return dataSources.customerService.getCustomers();
    },
    findCustomerById: (parent, {id}, {dataSources}, info)=>{
      return dataSources.customerService.getCustomerById(id);
    },
    filterCustomers: (parent, args, {dataSources}, info)=>{
      return dataSources.customerService.filterCustomers(args);
    },
    projects: (parent, args, {dataSources}, info)=>{
      return dataSources.projectService.getProjects();
    },
    findProjectById: (parent, {id}, {dataSources}, info)=>{
      return dataSources.projectService.getProjectsById(id);
    },
  },
  Customer: {
    async projects(customer, args, {dataSources}, info) {
      let projects = await dataSources.projectService.getProjects();
      let workingProjects =  projects.filter((project) => {
        return project.employees.includes(+customer.id);
      });
      
      return workingProjects;
    },
  },
}
const gqlServer = new ApolloServer({typeDefs, resolvers, dataSources});
gqlServer.listen({port: process.env.port || 4000})
.then(({url})=>console.log(`server is running on port ${url}`));