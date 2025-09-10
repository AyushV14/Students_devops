# Vagrantfile
Vagrant.configure("2") do |config|
  # Base OS: Ubuntu 20.04 LTS
  config.vm.box = "ubuntu/focal64"

  # VM settings
  config.vm.hostname = "students-prod"

  # Port forwarding (API via Nginx + MySQL)
  config.vm.network "forwarded_port", guest: 8080, host: 8080   # Nginx/API
  config.vm.network "forwarded_port", guest: 3306, host: 3308   # MySQL

  # Resources (adjust based on your laptop capacity)
  config.vm.provider "virtualbox" do |vb|
    vb.memory = "4096"   # 4 GB is safe
    vb.cpus = 2         # Use 4 vCPUs (good balance for 8-core CPUs, reduce to 2 if host lags)
  end

  # Sync project folder into VM
  config.vm.synced_folder ".", "/home/vagrant/app"

  # Provisioning
  config.vm.provision "shell", path: "provision/setup.sh"
end
