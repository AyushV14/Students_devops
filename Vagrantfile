# Vagrantfile
Vagrant.configure("2") do |config|
  # Base OS: Ubuntu 22.04 LTS
  config.vm.box = "ubuntu/focal64"

  # VM settings
  config.vm.hostname = "students-prod"
  config.vm.network "forwarded_port", guest: 8080, host: 8080   # expose Nginx/API to host
  config.vm.network "forwarded_port", guest: 3306, host: 3308   # expose DB if needed

  # Resources (adjust based on your laptop)
  config.vm.provider "virtualbox" do |vb|
    vb.memory = "2048"
    vb.cpus = 2
  end

  # Sync project folder into VM (/home/vagrant/app inside VM)
  config.vm.synced_folder ".", "/home/vagrant/app"

  # Provisioning (runs setup script automatically on vagrant up)
  config.vm.provision "shell", path: "provision/setup.sh"
end
