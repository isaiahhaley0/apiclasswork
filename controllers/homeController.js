var courses = [
    {title: "Raspberry Cake",
    cost:50     
    },
    {title: "Apple Sauce",
    cost:500     
    },
    {title: "Hamburger",
    cost:100     
    }
]


module.exports = {
    index: (req, res) => {
        res.render("index");
    }
}