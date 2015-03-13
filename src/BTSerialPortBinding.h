#ifndef NODE_BTSP_SRC_SERIAL_PORT_BINDING_H
#define NODE_BTSP_SRC_SERIAL_PORT_BINDING_H

#include <node.h>
#include <uv.h>
#include <nan.h>
#include "ngx-queue.h"

#ifdef __APPLE__
#import <Foundation/NSObject.h>
#import <IOBluetooth/objc/IOBluetoothDevice.h>
#import <IOBluetooth/objc/IOBluetoothDeviceInquiry.h>
#import "pipe.h"
#endif

class BTSerialPortBinding : public node::ObjectWrap {
    private:
#ifdef _WINDOWS_
        bool initialized;

        bool GetInitializedProperty() {
            return initialized;
        }
#endif

    public:
#ifdef _WINDOWS_
        __declspec(property(get = GetInitializedProperty)) bool Initialized;
#endif

        static v8::Persistent<v8::FunctionTemplate> s_ct;
        static void Init(v8::Handle<v8::Object> exports);
        static NAN_METHOD(Write);
        static NAN_METHOD(Close);
        static NAN_METHOD(Read);

    private:
        struct connect_baton_t {
            BTSerialPortBinding *rfcomm;
            uv_work_t request;
            NanCallback* cb;
            char address[40];
            int status;
            int channelID;
        };

        struct read_baton_t {
            BTSerialPortBinding *rfcomm;
            uv_work_t request;
            NanCallback* cb;
            unsigned char result[1024];
            int errorno;
            int size;
        };

        struct write_baton_t {
            BTSerialPortBinding *rfcomm;
            char address[40];
            void* bufferData;
            int bufferLength;
            v8::Persistent<v8::Object> buffer;
            NanCallback* callback;
            size_t result;
            char errorString[1024];
        };

        struct queued_write_t {
            uv_work_t req;
            ngx_queue_t queue;
            write_baton_t* baton;
        };


#ifdef __APPLE__
        pipe_consumer_t *consumer;
#else
#ifdef _WINDOWS_
        SOCKET s;
#else
        int s;
        int rep[2];
#endif
#endif

        BTSerialPortBinding();
        ~BTSerialPortBinding();

        static NAN_METHOD(New);
        static void EIO_Connect(uv_work_t *req);
        static void EIO_AfterConnect(uv_work_t *req);
        static void EIO_Write(uv_work_t *req);
        static void EIO_AfterWrite(uv_work_t *req);
        static void EIO_Read(uv_work_t *req);
        static void EIO_AfterRead(uv_work_t *req);
};

#endif
