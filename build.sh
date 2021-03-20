set directory_name = "dist";

if [ -d $directory_name ]
then
    echo '' 
else
    mkdir $directory_name
fi

webpack;
