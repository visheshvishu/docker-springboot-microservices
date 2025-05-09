@Library('Shared') _

pipeline {
    agent { label 'gcp' }

    // triggers {
    //     cron('H/5 * * * *')  // Runs every 5 minutes
    // }

    environment {
        scannerHome = tool 'sonar' 
    }

  tools {
    maven 'Maven'
  }

    stages {

        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Clone from GitHub') {
            steps {
                script{
                     // git branch: 'main', url: 'https://github.com/visheshvishu/flask-app.git'
                    git_checkout("https://github.com/visheshvishu/docker-springboot-microservices.git","main")
                }
            }
        }

       stage('Maven Build') {
            steps {
                withMaven(maven: 'Maven') {
            sh 'mvn clean install'
               }
            }
        }
      

        // stage('SonarQube Scan') {
        //     steps {
        //         script {
        //             sonar_scan("$ScannerHome", "sonar", "springboot-app", "springboot-app", "v1", ".")
        //         }
        //     }
        // }

      

        // stage('Quality Gate') {
        //     steps {
        //         script {
        //             waitForQualityGate abortPipeline: false, credentialsId: 'sonar'
        //         }
        //     }
        // }    
        
        // stage('OWASP Dependency Check') {
        //     steps {
        //         dependencyCheck additionalArguments: ''' 
        //             -o './'
        //             -s './'
        //             -f 'ALL' 
        //             --prettyPrint''', odcInstallation: 'owasp'
        
        // dependencyCheckPublisher pattern: 'dependency-check-report.xml'
        //     }
        // }
        
        stage('Build Docker Image') {
            steps {
                script {
                  def services = [
                'admin-server',
                'config-server',
                'eureka-server',
                'oauth2-server',
                'customer-service',
                'order-service',
                'zuul-server'
            ]

            for (service in services) {
                def imageName = "${service}"
                def contextDir = "${service}"
                
                docker_build(imageName, 'latest', contextDir)
                 }
            }
        }
      }
        
         stage('push to dockerhub') {
            steps {
                script{
                      
                    def services = [
                'admin-server',
                'config-server',
                'eureka-server',
                'oauth2-server',
                'customer-service',
                'order-service',
                'zuul-server'
            ]

            for (service in services) {
                def imageName = "${service}"
                     docker_push(imageName, 'visheshvishu', 'dockerhub', 'latest')
                }
            }        
        }
        
        stage('Run with Docker Compose') {
            steps {
                deploy_build()
            }
        }
        
    } //end of stages
        

    // post {
    //     success {
    //         echo 'pipeline completed successfully.'
    //     }
    //     failure {
    //         echo 'pipeline failed. Check logs for details.'
    //     }
    // }

    post {
    success {
      emailext(
        subject: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
        body: "Job Succeeded: ${env.BUILD_URL}",
        to: 'vishesh.gupta@oodles.io'
      )
    }
    failure {
      emailext(
        subject: "FAILURE: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
        body: "Job Failed: ${env.BUILD_URL}",
        to: 'vishesh.gupta@oodles.io'
      )
    }
  }
    
} //end of pipeline
