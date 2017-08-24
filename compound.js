var Compound = pc.createScript('compound');

Compound.prototype.initialize = function() {
    
    var bodyShape = new Ammo.btCompoundShape();
    
    var children = this.entity.findByTag("compound-shape");

    children.forEach(function(child) {    
        var childPosition = child.getLocalPosition();
        var childRotation = child.getLocalRotation();
        var childSize = child.collision.data.halfExtents;
        
        var childShape = new Ammo.btBoxShape(new Ammo.btVector3(childSize.x,childSize.y,childSize.z));
        var rotation = new Ammo.btQuaternion(childRotation.x,childRotation.y,childRotation.z,1);
        var position = new Ammo.btVector3(childPosition.x,childPosition.y,childPosition.z);
        bodyShape.addChildShape(new Ammo.btTransform(rotation, position), childShape);
        
        child.destroy();
    });
     
    var entityPosition = this.entity.getPosition();
    var position = new Ammo.btVector3(entityPosition.x, entityPosition.y, entityPosition.z);
    
    var state = new Ammo.btDefaultMotionState(new Ammo.btTransform(new Ammo.btQuaternion(0, 0, 0, 1), position));
    
    var fallInertia = new Ammo.btVector3(0, 0, 0);
    bodyShape.calculateLocalInertia(this.entity.rigidbody.mass, fallInertia);
    var rigidBodyCI = new Ammo.btRigidBodyConstructionInfo(this.entity.rigidbody.mass,state, bodyShape, fallInertia);
    
    this.rigidbody = new Ammo.btRigidBody(rigidBodyCI);
    this.rigidbody.setRestitution(this.entity.rigidbody.restitution);
    this.rigidbody.setFriction(this.entity.rigidbody.friction);
    this.rigidbody.setDamping(this.entity.rigidbody.linearDamping, this.entity.rigidbody.angularDamping);
    
    var linearFactor = this.entity.rigidbody.linearFactor;
    var angularFactor = this.entity.rigidbody.angularFactor;
    
    this.rigidbody.setLinearFactor(new Ammo.btVector3(linearFactor.x, linearFactor.y, linearFactor.z));
    this.rigidbody.setAngularFactor(new Ammo.btVector3(angularFactor.x, angularFactor.y, angularFactor.z));
    
    this.rigidbody.entity = this.entity;
    this.app.systems.rigidbody.dynamicsWorld.addRigidBody(this.rigidbody);
    this.entity.rigidbody.body = this.rigidbody;
    
};

Compound.prototype.update = function(dt) {
    
    var trans = new Ammo.btTransform();
    this.rigidbody.getMotionState().getWorldTransform(trans);  
    var pos = trans.getOrigin();
    var rot = trans.getRotation();
    this.entity.setRotation(new pc.Quat(rot.x(),rot.y(), rot.z(), rot.w()));
    this.entity.setPosition(pos.x(), pos.y(), pos.z());
    
};
