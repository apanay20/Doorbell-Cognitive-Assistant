<!-- ABOUT THE PROJECT -->
## About The Project

In this project we have implemented and evaluate three community detection algorithms.

* Louvain Algorithm
* Label Propagation Algorithm
* Girvan-Newman Algorithm

Authors:
* Andreas Panayiotou
* Theodoros Kyriakou

## Prerequisites
 
* SWI-Prolog
* Gorgias Argumentation Framework ([Link](http://www.cs.ucy.ac.cy/~nkd/gorgias/))
* Java
* A web server stack (ex. XAMPP)
  
<!-- USAGE EXAMPLES -->
## Usage

* Louvain Algorithm
  *  You can change randomBool global variable to True for random visit sequence and set a random seed.
  ```sh
  python Louvain.py
  ```
* Label Propagation Algorithm
  *  You can set the number of maximum iterations in ITERATIONS global variable.
  ```sh
  python LabelPropagation.py
  ```
* Girvan Newman Algorithm
  *  You can set the value of centralityValue global variable. This value is used in the calculation of betweenness centrality. If its None use all nodes of the network. In case of large network you can set a number of nodes k (where k <= number of nodes) to find an approximation of betweenness centrality.
  ```sh
  python GirvanNewman.py
  ```
## Demonstration

In this section you can see an overview of the assistant as also you can watch a video which shows the function of the assistant.

[Demo Video Youtube Link](https://www.youtube.com/watch?v=y_E-IDVxr_o)

<img src="Images/Demo.png">
